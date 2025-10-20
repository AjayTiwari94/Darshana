import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnimatedStoryContentProps {
  content: string
  direction: number
}

export const processMarkdown = (content: string) => {
  if (!content) return null
  
  const lines = content.split('\n')
  const processedLines = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check for ## headings
    if (line.startsWith('## ')) {
      const headingText = line.substring(3)
      processedLines.push(
        <h2 key={i} className="markdown-heading text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          {headingText}
        </h2>
      )
    } 
    // Check for ### subheadings
    else if (line.startsWith('### ')) {
      const headingText = line.substring(4)
      processedLines.push(
        <h3 key={i} className="markdown-subheading text-xl font-semibold text-gray-800 mt-6 mb-3">
          {headingText}
        </h3>
      )
    }
    // Handle paragraphs
    else if (line.trim() !== '') {
      processedLines.push(
        <p key={i} className="markdown-paragraph text-gray-700 mb-4 leading-relaxed">
          {line}
        </p>
      )
    }
    // Handle empty lines
    else if (line.trim() === '') {
      processedLines.push(<br key={i} />)
    }
  }
  
  return processedLines
}

const AnimatedStoryContent: React.FC<AnimatedStoryContentProps> = ({ 
  content, 
  direction 
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: direction * 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="prose prose-lg max-w-none"
      >
        {processMarkdown(content)}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimatedStoryContent