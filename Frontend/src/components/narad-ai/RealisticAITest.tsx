'use client'

import React from 'react'
import { processMarkdown } from './NaradAIChat'

const RealisticAITest = () => {
  const aiResponse = `## The Legend of the Taj Mahal

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

Would you like to know more about the **legends** surrounding the Taj Mahal or its *architectural features*?`;
  
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Realistic AI Response Processing Test</h1>
      <p className="mb-6 text-gray-600 text-center">This test demonstrates how a typical AI response with headings, bold, and italic text would be processed.</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-primary-700">AI Response Display</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="flex-1">
              {processMarkdown(aiResponse)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-primary-700">Raw AI Response</h2>
        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
          {aiResponse}
        </div>
      </div>
    </div>
  )
}

export default RealisticAITest