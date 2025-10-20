'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot,
  User,
  Loader,
  Sparkles,
  MapPin,
  BookOpen,
  Camera,
  AlertCircle,
  RotateCcw,
  Headphones,
  StopCircle,
  X
} from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { ComprehensiveTTSService, TTSProvider } from '@/services/tts/comprehensiveTTS'

// Enhanced markdown processor for headings and other formatting
export const processMarkdown = (content: string) => {
  // Handle null or undefined content
  if (!content) {
    console.log('processMarkdown received null/undefined content');
    return null;
  }
  
  console.log('processMarkdown processing content:', content);
  
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
  
  console.log('processMarkdown result:', processedLines);
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
  return result;
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
  
  return result;
}

const NaradAIChatWithVapiComponent = () => {
  const router = useRouter()
  const { 
    session, 
    messages, 
    isActive, 
    isLoading, 
    sendMessage, 
    startSession, 
    endSession,
    initialInput,
    setInitialInput,
    updateSessionContext,
    clearMessages,
    // Speech state from store
    isSpeaking,
    readingMessageId,
    setIsSpeaking,
    setReadingMessageId
  } = useNaradAIStore()
  
  const { naradAIOpen, setNaradAIOpen } = useUIStore()
  
  const [inputMessage, setInputMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [voiceToVoiceMode, setVoiceToVoiceMode] = useState(false) // Keep but disable functionality
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [selectedSpeechLang, setSelectedSpeechLang] = useState<'hi' | 'en' | 'bn' | 'ta' | 'te'>('en')
  const [selectedTTS, setSelectedTTS] = useState<TTSProvider>('vapi') // Default to Vapi
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentUtteranceRef = useRef<any>(null)
  const isProcessingRef = useRef(false)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isSpeakingRequestedRef = useRef(false)
  const speechQueueRef = useRef<string[]>([])
  const isSpeakingQueueRef = useRef(false)
  const isTogglingVoiceModeRef = useRef(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Initialize the TTS service - moved to the top
  const ttsService = useMemo(() => {
    const service = new ComprehensiveTTSService(selectedTTS);
    service.setAudioRef(audioRef);
    service.setOnStopCallback(() => {
      setIsSpeaking(false);
      setReadingMessageId(null);
    });
    return service;
  }, [selectedTTS, setIsSpeaking, setReadingMessageId]);

  // All functions need to be declared after ttsService
  // Function to detect language from text
  const detectLanguageFromText = (text: string): 'hi' | 'en' | 'bn' | 'ta' | 'te' => {
    // Hindi characters range
    if (/[\u0900-\u097F]/.test(text)) {
      return 'hi';
    }
    // Bengali characters range
    else if (/[\u0980-\u09FF]/.test(text)) {
      return 'bn';
    }
    // Tamil characters range
    else if (/[\u0B80-\u0BFF]/.test(text)) {
      return 'ta';
    }
    // Telugu characters range
    else if (/[\u0C00-\u0C7F]/.test(text)) {
      return 'te';
    }
    // Default to English
    else {
      return 'en';
    }
  };

  // Function to get speech language
  const getSpeechLang = () => {
    // Map selector short codes to BCP-47 locales commonly supported by browsers
    const langMap: Record<string, string> = {
      hi: 'hi-IN', // Hindi (India) - Default
      en: 'en-IN', // English (India)
      bn: 'bn-IN', // Bengali (India)
      ta: 'ta-IN', // Tamil (India)
      te: 'te-IN', // Telugu (India)
    }
    return langMap[selectedSpeechLang] || 'hi-IN' // Default to Hindi if not found
  }

  // Function to clean text for better TTS (remove emojis, normalize)
  const cleanTextForTTS = (text: string): string => {
    if (!text) return '';
    
    // Remove HTML tags first
    let cleaned = text.replace(/<[^>]*>/g, '');
    
    // Remove markdown formatting but keep the content
    cleaned = cleaned
      .replace(/#{1,6}\s+/g, '') // Remove heading markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
      .replace(/`([^`]+)`/g, '$1') // Remove inline code markers
      .replace(/!\[([^\]]+)\]\([^\)]+\)/g, '') // Remove image markdown
    
    // Remove zero-width characters and normalize whitespace
    cleaned = cleaned
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return cleaned;
  }

  // Function to stop current speech
  const stopSpeaking = () => {
    console.log('Stopping speech...')
    ttsService.stopSpeaking();
    
    // Add a delay to ensure all speech is stopped
    setTimeout(() => {
      ttsService.stopSpeaking();
    }, 100);
  }

  // Function to stop all speech
  const stopAllSpeech = useCallback(() => {
    console.log('Stopping all speech')
    
    // Stop audio (ElevenLabs compatibility)
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ''
        console.log('Audio stopped')
      } catch (error) {
        console.error('Error stopping audio:', error)
      }
    }
    
    // Stop Vapi TTS
    ttsService.stopSpeaking();
    
    // Clear current utterance reference
    currentUtteranceRef.current = null;
    
    // Reset speaking state
    setIsSpeaking(false)
    setReadingMessageId(null)
    
    // Clear any silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    
    // Reset speaking request flag
    isSpeakingRequestedRef.current = false;
    
    // Clear speech queue
    speechQueueRef.current = [];
    isSpeakingQueueRef.current = false;
  }, [audioRef, currentUtteranceRef, silenceTimerRef, setIsSpeaking, setReadingMessageId, ttsService])

  // Function to add speech to queue to prevent interruptions
  // Function to process speech queue
  const processSpeechQueue = useCallback(async (lang?: string) => {
    // If already processing or queue is empty, return
    if (isSpeakingQueueRef.current || speechQueueRef.current.length === 0) {
      return;
    }
    
    isSpeakingQueueRef.current = true;
    
    while (speechQueueRef.current.length > 0) {
      const text = speechQueueRef.current.shift();
      if (text) {
        try {
          // Stop any ongoing speech before starting new speech
          ttsService.stopSpeaking();
          
          // Add a small delay to ensure all speech is stopped
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Get the appropriate language code
          const speechLang = lang || getSpeechLang();
          console.log('Processing speech from queue:', text);
          
          // Validate text before processing
          if (!text.trim()) {
            console.log('Skipping empty text in speech queue');
            continue;
          }
          
          // Clean text before speaking
          const cleanText = cleanTextForTTS(text);
          if (!cleanText) {
            console.log('Skipping invalid text after cleaning:', text);
            continue;
          }
          
          // Use the selected TTS service
          console.log('Using', selectedTTS, 'for speech synthesis from queue')
          await ttsService.speakText(cleanText, speechLang)
          
          // Wait for speech to complete or timeout
          await new Promise(resolve => {
            let timeoutId: NodeJS.Timeout;
            const checkSpeaking = () => {
              // Clear timeout if speech has ended
              if (!isSpeaking) {
                clearTimeout(timeoutId);
                resolve(null);
              }
              // Otherwise check again in 100ms
              else {
                setTimeout(checkSpeaking, 100);
              }
            };
            
            // Set a timeout to prevent infinite waiting
            timeoutId = setTimeout(() => {
              console.log('Speech timeout reached, forcing completion');
              resolve(null);
            }, 30000); // 30 second timeout
            
            // Start checking
            checkSpeaking();
          });
        } catch (error: any) {
          console.error("Error processing speech from queue:", error);
          setError("Speak feature is not available currently, we are working on it");
        }
      }
    }
    
    isSpeakingQueueRef.current = false;
  }, [selectedTTS, ttsService, isSpeaking]); // Added selectedTTS dependency
  
  // Function to add speech to queue to prevent interruptions
  const queueSpeech = useCallback((text: string, lang?: string) => {
    console.log('Queueing speech:', text, 'with language:', lang);
    speechQueueRef.current.push(text);
    // Add a small delay to ensure proper queuing
    setTimeout(() => {
      processSpeechQueue(lang);
    }, 150);
  }, [processSpeechQueue]);

  // Function to speak text (main function) - MODIFIED TO ALWAYS SPEAK WHEN CALLED
  const speakText = useCallback(async (text: string, lang: string = 'hi-IN') => {
    // Always speak when this function is called, regardless of voiceToVoiceMode
    // Add speech to queue to prevent interruptions
    queueSpeech(text, lang);
  }, [queueSpeech]);
  
  // Function to handle closing the chat
  const handleCloseChat = useCallback(() => {
    // Stop any ongoing speech
    stopAllSpeech();
    
    // Close the chat
    setNaradAIOpen(false);
    
    // End session if active
    if (isActive) {
      endSession();
    }
  }, [stopAllSpeech, setNaradAIOpen, isActive, endSession]);
  
  // Function to handle stopping speech
  const handleStopSpeaking = useCallback(() => {
    stopSpeaking();
  }, []);
  
  // Function to handle speaking a message
  const handleSpeakMessage = useCallback((messageId: string, text: string) => {
    // If already reading this message, stop speaking
    if (readingMessageId === messageId && isSpeaking) {
      stopSpeaking();
      return;
    }
    
    // Set reading state
    setReadingMessageId(messageId);
    setIsSpeaking(true);
    
    // Detect language from text
    const detectedLanguage = detectLanguageFromText(text);
    const speechLang = getSpeechLang();
    
    // Speak the text
    speakText(text, speechLang);
  }, [readingMessageId, isSpeaking, setReadingMessageId, setIsSpeaking, speakText, detectLanguageFromText, getSpeechLang]);
  
  // Memoize language options to prevent re-rendering
  const languageOptions = useMemo<{ value: string; label: string }[]>(() => [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' }
  ], []);
  
  // Memoize TTS options to prevent re-rendering
  const ttsOptions = useMemo<{ value: TTSProvider; label: string }[]>(() => [
    { value: 'vapi', label: 'Vapi AI' },
    { value: 'vapi-web', label: 'Vapi Web TTS' },
    { value: 'elevenlabs', label: 'ElevenLabs' }
    // Completely removed web-speech option as per user request
  ], []);
  
  // Process messages with markdown
  const processedMessages = useMemo(() => {
    return messages.map(message => ({
      ...message,
      processedContent: processMarkdown(message.content)
    }));
  }, [messages]);

  // Add the missing functions here
  const handleSendMessage = useCallback(async () => {
    console.log('=== handleSendMessage called ===');
    console.log('Input message:', inputMessage);
    console.log('Is loading:', isLoading);
    
    if (!inputMessage.trim() || isLoading) {
      console.log('Not sending message - empty or loading');
      return
    }
    
    const message = inputMessage.trim()
    console.log('Sending message:', message)
    setInputMessage('')
    setInterimTranscript('') // Clear interim transcript
    setShowSuggestions(false)
    // Clear any previous errors when sending a new message
    setError(null)
    
    // Detect language from user input and update session context
    const detectedLanguage = detectLanguageFromText(message);
    console.log('Detected language:', detectedLanguage);
    
    // Update session context with detected language
    if (session) {
      updateSessionContext({
        preferences: {
          ...session.context.preferences,
          language: detectedLanguage
        }
      });
    }
    
    // Update selected speech language to match detected language
    setSelectedSpeechLang(detectedLanguage);
    
    // Start session if not active
    if (!isActive) {
      console.log('Starting new session')
      startSession()
    }
    
    try {
      console.log('Calling sendMessage with message:', message);
      await sendMessage(message)
      console.log('Message sent successfully')
    } catch (error) {
      console.error('Failed to send message:', error)
      setError('Failed to send message. Please try again.')
    }
  }, [inputMessage, isLoading, isActive, startSession, sendMessage, session, updateSessionContext, detectLanguageFromText])
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Allow sending message with Ctrl+Enter even in voice-to-voice mode
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
    // Stop recording on Escape key
    else if (e.key === 'Escape' && isRecording) {
      toggleVoiceRecording()
    }
  }
  
  // Function to toggle voice recording
  const toggleVoiceRecording = useCallback(() => {
    if (!speechSupported) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
    
    if (isRecording) {
      console.log('Stopping voice recording');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      console.log('Starting voice recording');
      // Clear any previous errors when starting recording
      setError(null);
      if (recognitionRef.current) {
        try {
          // For speech recognition, we want to detect the language automatically
          // So we don't set a specific language, allowing the browser to detect it
          // However, if a specific language is selected, we can use that
          console.log('Starting recognition with language detection');
          recognitionRef.current.lang = ''; // Empty string allows automatic language detection
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (error) {
          console.error('Error starting speech recognition:', error);
          setError('Failed to start voice recording. Please check microphone permissions.');
          setIsRecording(false);
        }
      } else {
        setError('Speech recognition not properly initialized.');
        setIsRecording(false);
      }
    }
  }, [isRecording, speechSupported]);

  return (
    <div className={`fixed inset-0 z-50 ${naradAIOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseChat} />
      <div className="absolute bottom-4 right-4 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Bot className="text-primary-600" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Narad AI</h3>
              <p className="text-primary-100 text-xs">Your Cultural Guide</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Language Selection Dropdown */}
            <select
              value={selectedSpeechLang}
              onChange={(e) => setSelectedSpeechLang(e.target.value as 'hi' | 'en' | 'bn' | 'ta' | 'te')}
              className="narad-ai-dropdown"
              title="Select language for speech"
            >
              {languageOptions.map((option: { value: string; label: string }) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {/* TTS Selection Dropdown */}
            <select
              value={selectedTTS}
              onChange={(e) => setSelectedTTS(e.target.value as TTSProvider)}
              className="narad-ai-dropdown"
              title="Select Text-to-Speech service"
            >
              {ttsOptions.map((option: { value: TTSProvider; label: string }) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {/* Stop Speaking Button - Always show but disable when not needed */}
            <button
              onClick={handleStopSpeaking}
              disabled={!isSpeaking}
              className={`p-2 rounded-full ${
                isSpeaking 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 shadow-md' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-all duration-200 flex items-center justify-center`}
              aria-label={isSpeaking ? "Stop speaking" : "Speech controls"}
              title={isSpeaking ? "Stop AI from speaking" : "Speech controls"}
            >
              {isSpeaking ? <StopCircle size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              onClick={handleCloseChat}
              className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all duration-200"
              aria-label="Close chat"
              title="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {processedMessages.map((message: any, index: number) => {
            return (
              <div
                key={message._id}
                className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {message.type === 'ai' ? (
                    <div className="flex items-start">
                      <div className="flex-1">
                        {message.processedContent}
                      </div>
                      {/* Read/Stop button for AI messages */}
                      <button
                        onClick={() => handleSpeakMessage(message._id, message.content)}
                        className={`ml-2 p-1 rounded-full ${
                          readingMessageId === message._id && isSpeaking 
                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        } transition-all duration-200 shadow-sm`}
                        aria-label={readingMessageId === message._id && isSpeaking ? "Stop reading" : "Read message"}
                        title={readingMessageId === message._id && isSpeaking ? "Stop reading this message" : "Read this message aloud"}
                      >
                        {readingMessageId === message._id && isSpeaking ? (
                          <StopCircle size={16} className="text-white" />
                        ) : (
                          <Volume2 size={16} className="text-white" />
                        )}
                      </button>
                    </div>
                  ) : (
                    message.processedContent
                  )}
                </div>
              </div>
            );
          })}
          {/* Loading indicator when AI is thinking */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm">
                <div className="flex items-center">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="ml-2 text-gray-500">Narad is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          {error && (
            <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded-lg flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}
          <div className="flex items-center space-x-2">
            {/* Speech-to-text recording button */}
            <button
              onClick={toggleVoiceRecording}
              disabled={!speechSupported || !audioEnabled}
              className={`p-2 rounded-full ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : speechSupported && audioEnabled
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-all duration-200 shadow-md`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              title={isRecording ? "Stop voice recording" : "Start voice recording"}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Indian culture..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                title="Type your message here"
              />
              {interimTranscript && (
                <div className="absolute inset-0 px-4 py-2 text-gray-500 pointer-events-none">
                  {inputMessage} <span className="text-gray-400">{interimTranscript}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`p-2 rounded-full ${
                inputMessage.trim() && !isLoading
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-all duration-200`}
              aria-label="Send message"
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(NaradAIChatWithVapiComponent);