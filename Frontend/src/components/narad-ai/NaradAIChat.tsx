'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Loader,
  Sparkles,
  MapPin,
  BookOpen,
  Camera,
  AlertCircle,
  RotateCcw
} from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'

// Enhanced markdown processor for headings and other formatting
export const processMarkdown = (content: string) => {
  if (!content) return null;
  
  // Split content by newlines
  const lines = content.split('\n')
  const processedLines = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check for ## headings
    if (line.startsWith('## ')) {
      const headingText = line.substring(3)
      processedLines.push(
        <h3 key={i} className="markdown-heading text-lg">
          {headingText}
        </h3>
      )
    } 
    // Check for ### subheadings
    else if (line.startsWith('### ')) {
      const headingText = line.substring(4)
      processedLines.push(
        <h4 key={i} className="markdown-subheading text-md">
          {headingText}
        </h4>
      )
    }
    // Handle complex formatting (bold, italic, etc.)
    else if (line.includes('**') || line.includes('*')) {
      // Process the line for formatting
      const processedLine = processInlineFormatting(line)
      processedLines.push(
        <p key={i} className="markdown-paragraph">
          {processedLine}
        </p>
      )
    }
    // Handle empty lines
    else if (line.trim() === '') {
      processedLines.push(<br key={i} />)
    }
    // Handle regular paragraphs
    else {
      processedLines.push(
        <p key={i} className="markdown-paragraph">
          {line}
        </p>
      )
    }
  }
  
  return processedLines
}

// Process inline formatting (bold, italic, etc.)
const processInlineFormatting = (text: string) => {
  if (!text) return text;
  
  // We'll process formatting in a specific order to handle nesting correctly
  // First process bold (**), then italic (*)
  let result: (string | JSX.Element)[] = [text]
  
  // Process bold formatting (**)
  result = processFormatting(result, '**', 'bold')
  
  // Process italic formatting (*)
  result = processFormatting(result, '*', 'italic')
  
  // If we only have one element and it's a string, return it directly
  if (result.length === 1 && typeof result[0] === 'string') {
    return result[0]
  }
  
  // Otherwise, return the array of elements
  return result
}

// Generic function to process formatting
const processFormatting = (elements: (string | JSX.Element)[], marker: string, type: string) => {
  const result: (string | JSX.Element)[] = []
  
  elements.forEach((element, index) => {
    // Only process string elements
    if (typeof element === 'string') {
      const parts = element.split(marker)
      
      // If we don't have enough parts for formatting, just add the element as is
      if (parts.length < 3) {
        result.push(element)
        return
      }
      
      // Process the parts
      for (let i = 0; i < parts.length; i++) {
        // Even indices (0, 2, 4, ...) are regular text
        if (i % 2 === 0) {
          if (parts[i] !== '') {
            result.push(parts[i])
          }
        } 
        // Odd indices (1, 3, 5, ...) are formatted text
        else {
          if (type === 'bold') {
            result.push(<strong key={`${index}-${i}`} className="markdown-bold">{parts[i]}</strong>)
          } else if (type === 'italic') {
            result.push(<em key={`${index}-${i}`} className="markdown-italic">{parts[i]}</em>)
          }
        }
      }
    } else {
      // Non-string elements (like already processed elements) are added as is
      result.push(element)
    }
  })
  
  return result
}

const NaradAIChat = () => {
  const { 
    session, 
    messages, 
    isActive, 
    isLoading, 
    sendMessage, 
    startSession, 
    endSession,
    clearMessages 
  } = useNaradAIStore()
  
  const { naradAIOpen, setNaradAIOpen } = useUIStore()
  
  const [inputMessage, setInputMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Focus input when chat opens
  useEffect(() => {
    if (naradAIOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [naradAIOpen, isMinimized])
  
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return
    
    const message = inputMessage.trim()
    setInputMessage('')
    setShowSuggestions(false)
    setError(null)
    
    // Start session if not active
    if (!isActive) {
      startSession()
    }
    
    try {
      await sendMessage(message)
    } catch (error) {
      console.error('Failed to send message:', error)
      setError('Failed to send message. Please try again.')
      // Add error message to chat
      // Error message is now handled in the store
    }
  }, [inputMessage, isLoading, isActive, startSession, sendMessage])
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    setShowSuggestions(false)
    // Auto-send suggestion after a brief delay
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }
  
  const toggleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      // In a real implementation, this would process the recorded audio
    } else {
      // Start recording
      setIsRecording(true)
      // In a real implementation, this would start audio recording
    }
  }
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }
  
  const handleClose = () => {
    setNaradAIOpen(false)
  }
  
  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }
  
  const handleRetry = () => {
    setError(null)
  }
  
  const defaultSuggestions = useMemo(() => [
    "Tell me about Taj Mahal",
    "Share a ghost story",
    "What myths are famous in India?",
    "Plan my cultural journey",
    "Show me AR experiences",
    "Start a treasure hunt"
  ], [])
  
  if (!naradAIOpen) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        } flex flex-col transition-all duration-300`}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                {isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Narad AI</h3>
                <p className="text-sm text-gray-500">
                  {isActive ? 'Your Cultural Guide' : 'Offline'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAudio}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={audioEnabled ? 'Mute' : 'Unmute'}
                aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
              >
                {audioEnabled ? (
                  <Volume2 size={16} className="text-gray-600" />
                ) : (
                  <VolumeX size={16} className="text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleMinimize}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={isMinimized ? 'Maximize' : 'Minimize'}
                aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
              >
                {isMinimized ? (
                  <Maximize2 size={16} className="text-gray-600" />
                ) : (
                  <Minimize2 size={16} className="text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
                aria-label="Close chat"
              >
                <span className="text-gray-600">×</span>
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot className="text-white" size={24} />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Welcome to Narad AI!</h4>
                    <p className="text-gray-600 text-sm">
                      I'm your intelligent cultural guide. Ask me about monuments, stories, myths, or anything about Indian heritage!
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-start space-x-2 mb-1">
                          {message.type === 'ai' && (
                            <Bot size={14} className="text-primary-600 mt-1 flex-shrink-0" />
                          )}
                          {message.type === 'user' && (
                            <User size={14} className="text-white mt-1 flex-shrink-0" />
                          )}
                          <div className="text-sm leading-relaxed">
                            {processMarkdown(message.content)}
                          </div>
                        </div>
                        
                        {/* AI Message Metadata */}
                        {message.type === 'ai' && message.metadata?.suggestedActions && message.metadata.suggestedActions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.metadata.suggestedActions.slice(0, 3).map((action: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestionClick(action)}
                                className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full hover:bg-primary-200 transition-colors"
                                aria-label={`Suggested action: ${action}`}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Related Content */}
                        {message.type === 'ai' && message.metadata?.relatedStories && message.metadata.relatedStories.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.metadata.relatedStories.slice(0, 2).map((story: string, idx: number) => (
                              <div key={idx} className="flex items-center space-x-1 text-xs text-gray-600">
                                <BookOpen size={12} />
                                <span>{story}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                
                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl max-w-xs">
                      <div className="flex items-center space-x-2">
                        <Bot size={14} className="text-primary-600" />
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="text-sm text-gray-600">Narad is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-2xl max-w-xs">
                      <div className="flex items-center space-x-2">
                        <AlertCircle size={14} className="text-red-600" />
                        <span className="text-sm text-red-700">{error}</span>
                        <button 
                          onClick={handleRetry}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Retry"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Suggestions */}
              {showSuggestions && messages.length === 0 && (
                <div className="px-4 pb-2">
                  <div className="text-xs text-gray-500 mb-2">Try asking:</div>
                  <div className="flex flex-wrap gap-2">
                    {defaultSuggestions.slice(0, 4).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={`Suggestion: ${suggestion}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask Narad about culture, stories, monuments..."
                      className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      disabled={isLoading}
                      aria-label="Type your message"
                    />
                    
                    <button
                      onClick={toggleVoiceRecording}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                        isRecording 
                          ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }`}
                      title={isRecording ? 'Stop Recording' : 'Voice Input'}
                      aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                    >
                      {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Send Message"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors" aria-label="Share location">
                      <MapPin size={12} />
                      <span>Share Location</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors" aria-label="Take photo">
                      <Camera size={12} />
                      <span>Take Photo</span>
                    </button>
                  </div>
                  
                  {messages.length > 0 && (
                    <button
                      onClick={clearMessages}
                      className="hover:text-red-600 transition-colors"
                      aria-label="Clear chat"
                    >
                      Clear Chat
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NaradAIChat