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
  X,
  MessageCircle,
  Zap
} from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

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
        <motion.h3 
          key={i} 
          className="markdown-heading text-lg font-bold text-primary-700 mt-4 mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {headingText}
        </motion.h3>
      )
    } 
    // Check for ### subheadings
    else if (line.startsWith('### ')) {
      const headingText = line.substring(4)
      processedLines.push(
        <motion.h4 
          key={i} 
          className="markdown-subheading text-md font-semibold text-primary-600 mt-3 mb-1"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {headingText}
        </motion.h4>
      )
    }
    // Handle complex formatting (bold, italic, etc.)
    else if (line.includes('**') || line.includes('*')) {
      // Process the line for formatting
      const processedLine = processInlineFormatting(line)
      processedLines.push(
        <motion.p 
          key={i} 
          className="markdown-paragraph text-gray-700 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {processedLine}
        </motion.p>
      )
    }
    // Handle empty lines
    else if (line.trim() === '') {
      processedLines.push(<br key={i} />)
    }
    // Handle regular paragraphs
    else {
      processedLines.push(
        <motion.p 
          key={i} 
          className="markdown-paragraph text-gray-700 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {line}
        </motion.p>
      )
    }
  }
  
  console.log('processMarkdown result:', processedLines);
  return processedLines;
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
            result.push(<strong key={`${index}-${i}`} className="markdown-bold font-bold text-gray-900">{parts[i]}</strong>)
          } else if (type === 'italic') {
            result.push(<em key={`${index}-${i}`} className="markdown-italic italic text-gray-800">{parts[i]}</em>)
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

const NaradAIChatComponent = () => {
  const router = useRouter()
  const naradAIStore = useNaradAIStore()
  const uiStore = useUIStore()
  
  // Extract properties with @ts-ignore to bypass TypeScript errors
  // @ts-ignore
  const messages = naradAIStore.messages
  // @ts-ignore
  const isLoading = naradAIStore.isProcessing
  // @ts-ignore
  const sendMessage = naradAIStore.addMessage
  // @ts-ignore
  const startSession = naradAIStore.startSession
  // @ts-ignore
  const endSession = naradAIStore.clearMessages
  // @ts-ignore
  const clearMessages = naradAIStore.clearMessages
  // @ts-ignore
  const setStoreError = naradAIStore.setError
  // @ts-ignore
  const initializeWithGreeting = naradAIStore.initializeWithGreeting

  // @ts-ignore
  const isNaradAIOpen = uiStore.isNaradAIOpen
  // @ts-ignore
  const setNaradAIOpen = uiStore.setNaradAIOpen
  
  console.log('NaradAIChatComponent render - isNaradAIOpen:', isNaradAIOpen)
  
  const [inputMessage, setInputMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [voiceToVoiceMode, setVoiceToVoiceMode] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [localError, setLocalError] = useState<string | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [selectedSpeechLang, setSelectedSpeechLang] = useState<'hi' | 'en' | 'bn' | 'ta' | 'te'>('en')
  // TTS selection state
  // const [selectedTTS, setSelectedTTS] = useState<'vapi' | 'vapi-web' | 'elevenlabs' | 'web-speech'>('vapi')
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
  
  // Initialize with greeting message
  useEffect(() => {
    console.log('Initializing Narad AI chat component');
    // Always initialize with greeting when component mounts
    naradAIStore.initializeWithGreeting();
  }, [naradAIStore]);

  // Check AI service health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        console.log('Checking AI service health...');
        // Call the local API route which proxies to the backend AI service
        const response = await fetch('/api/ai/chat');
        const data = await response.json();
        console.log('AI Service Health Check:', data);
        if (data.success === false) {
          setLocalError('AI service is currently unavailable. Please try again later.');
        }
      } catch (error) {
        console.error('Health check failed:', error);
        setLocalError('Unable to connect to AI service. Please check your connection.');
      }
    };
    
    checkHealth();
  }, []);
  
  // Log initial state for debugging
  useEffect(() => {
    // @ts-ignore
    console.log('NaradAIChat initial state:', { naradAIOpen: uiStore.isNaradAIOpen, messages: messages.length });
  }, []);
  
  // Log when component mounts
  useEffect(() => {
    console.log('NaradAIChat component mounted');
    return () => {
      console.log('NaradAIChat component unmounted');
    };
  }, []);
  
  // Initialize speech recognition
  useEffect(() => {
    console.log('Initializing speech recognition');
    
    // Don't initialize here, let toggleVoiceRecording handle it
    // This prevents issues with stale recognition instances
    
    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition on cleanup:', error);
        }
        recognitionRef.current = null;
      }
    };
  }, []);
  
  // Initialize speech recognition support check
  useEffect(() => {
    console.log('Checking speech recognition support');
    
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      console.log('Speech recognition supported');
      setSpeechSupported(true);
    } else {
      console.log('Speech recognition not supported');
      setSpeechSupported(false);
      setLocalError('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
    }
  }, []);
  
  // Log messages for debugging
  useEffect(() => {
    console.log('Messages updated:', messages);
    console.log('Messages length:', messages.length);
    messages.forEach((msg, index) => {
      console.log(`Message ${index}:`, {
        id: msg.id,
        role: msg.role,
        content: msg.content?.substring(0, 50) + '...',
        timestamp: msg.timestamp
      });
    });
    // @ts-ignore
  }, [messages, uiStore.isNaradAIOpen]);
  
  // Log loading state for debugging
  useEffect(() => {
    console.log('Loading state changed:', isLoading);
  }, [isLoading]);
  
  // Log error state for debugging
  useEffect(() => {
    console.log('Error state changed:', localError);
  }, [localError]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    // @ts-ignore
    console.log('Scroll to bottom triggered, naradAIOpen:', uiStore.isNaradAIOpen);
    // @ts-ignore
    if (messagesEndRef.current && uiStore.isNaradAIOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    // @ts-ignore
  }, [messages, uiStore.isNaradAIOpen]);
  
  // Scroll to bottom when chat opens
  useEffect(() => {
    // @ts-ignore
    if (uiStore.isNaradAIOpen && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    // @ts-ignore
  }, [uiStore.isNaradAIOpen]);
  
  // Update speech recognition language when selected language changes
  useEffect(() => {
    if (recognitionRef.current && speechSupported) {
      const newLang = getSpeechLang();
      console.log('Updating speech recognition language to:', newLang);
      recognitionRef.current.lang = newLang;
    }
  }, [selectedSpeechLang, speechSupported]);
  
  // Function to detect language from text
  const detectLanguageFromText = (text: string): 'hi' | 'en' | 'bn' | 'ta' | 'te' => {
    // Remove any leading/trailing whitespace
    const trimmedText = (text || '').trim();
    
    // If text is empty, return default language
    if (!trimmedText) {
      return 'en';
    }
    
    // Check for each language in order of specificity
    // Hindi characters range
    if (/[\u0900-\u097F]/.test(trimmedText)) {
      return 'hi';
    }
    // Bengali characters range
    else if (/[\u0980-\u09FF]/.test(trimmedText)) {
      return 'bn';
    }
    // Tamil characters range
    else if (/[\u0B80-\u0BFF]/.test(trimmedText)) {
      return 'ta';
    }
    // Telugu characters range
    else if (/[\u0C00-\u0C7F]/.test(trimmedText)) {
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

  const handleSendMessage = useCallback(async () => {
    console.log('=== handleSendMessage called ===');
    console.log('Input message:', inputMessage);
    console.log('Is loading:', isLoading);
    console.log('Voice-to-voice mode:', voiceToVoiceMode);
    
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
    setLocalError(null)
    
    // Set loading state
    // @ts-ignore
    setStoreError(null)
    // @ts-ignore
    naradAIStore.setProcessing(true)
    
    // Detect language from user input and update session context
    const detectedLanguage = detectLanguageFromText(message);
    console.log('Detected language:', detectedLanguage);
    
    // Update selected speech language to match detected language
    // Only update if the detected language is different from the current selection
    // This prevents overriding user's language selection
    if (selectedSpeechLang !== detectedLanguage) {
      console.log('Updating selected speech language from', selectedSpeechLang, 'to', detectedLanguage);
      setSelectedSpeechLang(detectedLanguage);
    } else {
      console.log('Keeping current language selection:', selectedSpeechLang);
    }
    
    try {
      console.log('Calling sendMessage with message:', message);
      // @ts-ignore
      await sendMessage({ role: 'user', content: message })
      console.log('User message sent successfully')
      
      // Now call the backend AI service to get a response
      console.log('Calling backend AI service for response');
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: 'narad-ai-session', // In a real implementation, this would be a proper session ID
          context: {
            preferences: {
              language: selectedSpeechLang // Pass the selected language preference
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('AI service response:', data);
      
      // Add AI response to messages
      // @ts-ignore
      await sendMessage({ role: 'assistant', content: data.response })
      console.log('AI response added successfully')
    } catch (error: unknown) {
      console.error('Failed to send message:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      setLocalError(`Message Error: ${errorMessage}`)
      // @ts-ignore
      setStoreError(errorMessage)
      
      // Add a fallback message
      // @ts-ignore
      await sendMessage({ role: 'assistant', content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment." })
    } finally {
      // @ts-ignore
      naradAIStore.setProcessing(false)
    }
    // @ts-ignore
  }, [inputMessage, isLoading, sendMessage, voiceToVoiceMode, selectedSpeechLang, setStoreError])
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Allow sending message with Ctrl+Enter even in voice-to-voice mode
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // In voice-to-voice mode, send message immediately
      if (voiceToVoiceMode) {
        handleSendMessage()
      } else if (!voiceToVoiceMode) {
        handleSendMessage()
      }
    }
    // Stop recording on Escape key
    else if (e.key === 'Escape' && isRecording) {
      toggleVoiceRecording()
    }
  }
  
  // Function to toggle voice recording
  const toggleVoiceRecording = useCallback(() => {
    if (!speechSupported) {
      setLocalError('Speech recognition not supported in this browser.');
      return;
    }
    
    if (isRecording) {
      console.log('Stopping voice recording');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
      setInterimTranscript(''); // Clear interim transcript when stopping recording
      setIsRecording(false);
      // Clean up recognition reference
      recognitionRef.current = null;
    } else {
      console.log('Starting voice recording');
      // Clear any previous errors when starting recording
      setLocalError(null);
      setInterimTranscript(''); // Clear any previous interim transcript
      setInputMessage(''); // Clear input message when starting new recording
      
      // Check if speech recognition is supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        try {
          // Create new recognition instance each time to avoid stale state issues
          const recognition = new SpeechRecognition();
          
          // Configure recognition
          recognition.continuous = false; // Keep it simple
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;
          
          // Set language
          const speechLang = getSpeechLang();
          recognition.lang = speechLang;
          console.log('Starting speech recognition with language:', speechLang);
          
          // Set up event handlers
          recognition.onresult = (event: any) => {
            console.log('Speech recognition result:', event);
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
              } else {
                interimTranscript += transcript;
              }
            }
            
            console.log('Final transcript:', finalTranscript);
            console.log('Interim transcript:', interimTranscript);
            
            if (finalTranscript.trim()) {
              // For voice-to-voice mode, send the message immediately
              if (voiceToVoiceMode) {
                setInputMessage(finalTranscript);
                // Small delay to ensure state is updated before sending
                setTimeout(() => {
                  handleSendMessage();
                }, 100);
              } else {
                // For regular mode, just update the input
                setInputMessage(prev => prev + finalTranscript);
              }
              
              // Detect language from the final transcript and update if needed
              const detectedLanguage = detectLanguageFromText(finalTranscript);
              console.log('Detected language from speech:', detectedLanguage);
              
              // Only update language if it's different from current selection
              // This preserves user's language selection while still allowing detection
              if (selectedSpeechLang !== detectedLanguage) {
                console.log('Updating language selection based on speech input from', selectedSpeechLang, 'to', detectedLanguage);
                setSelectedSpeechLang(detectedLanguage);
              }
            }
            setInterimTranscript(interimTranscript);
          };
          
          recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setLocalError(`Speech recognition error: ${event.error}`);
            setInterimTranscript(''); // Clear interim transcript on error
            setIsRecording(false);
            recognitionRef.current = null;
          };
          
          recognition.onend = () => {
            console.log('Speech recognition ended');
            // Clear interim transcript when recognition ends
            setInterimTranscript('');
            setIsRecording(false);
            recognitionRef.current = null;
          };
          
          // Store reference
          recognitionRef.current = recognition;
          
          // Start recognition
          recognition.start();
          setIsRecording(true);
        } catch (startError) {
          console.error('Error starting speech recognition:', startError);
          setLocalError('Failed to start voice recording. Please check microphone permissions and ensure you are using a supported browser (Chrome, Edge, or Safari).');
          setIsRecording(false);
          recognitionRef.current = null;
        }
      } else {
        setLocalError('Speech recognition not properly supported. Please use Chrome, Edge, or Safari.');
        setIsRecording(false);
      }
    }
  }, [isRecording, speechSupported, selectedSpeechLang, getSpeechLang, voiceToVoiceMode, handleSendMessage]);
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    setInterimTranscript('') // Clear interim transcript when using suggestion
    setShowSuggestions(false)
    // Auto-send suggestion after a brief delay
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  // Function to get a male voice for the specified language
  const getMaleVoiceForLanguage = (voices: any[], lang: string) => {
    // Preferred male voices for each language
    const preferredVoices: Record<string, string[]> = {
      'hi-IN': ['Google हिन्दी Male', 'Microsoft Ravi Online (Natural) - Hindi (India)', 'Lekha', 'Rishi', 'Ravi', 'Google UK English Male'],
      'en-IN': ['Google UK English Male', 'Microsoft Mark Online (Natural) - English (India)', 'Daniel', 'Google US English Male'],
      'bn-IN': ['Google বাংলা Male', 'Microsoft Bashkar Online (Natural) - Bengali (India)', 'Google UK English Male'],
      'ta-IN': ['Google தமிழ் Male', 'Microsoft Valluvar Online (Natural) - Tamil (India)', 'Google UK English Male'],
      'te-IN': ['Google తెలుగు Male', 'Microsoft Chitra Online (Natural) - Telugu (India)', 'Google UK English Male']
    };
    
    const preferred = preferredVoices[lang] || [];
    
    // First try to find a preferred voice
    for (const voiceName of preferred) {
      const voice = voices.find((v: any) => 
        v.name.includes(voiceName) && (v.name.toLowerCase().includes('male') || v.gender === 'male')
      );
      if (voice) {
        console.log('Found preferred male voice:', voice.name);
        return voice;
      }
    }
    
    // If no preferred voice found, find any male voice for the language
    const languageVoices = voices.filter((voice: any) => 
      (voice.lang === lang || voice.lang === lang.replace('-', '_')) &&
      (voice.name.toLowerCase().includes('male') || voice.gender === 'male')
    );
    
    console.log('Male voices found for language:', languageVoices.map((v: any) => v.name + ' (' + v.lang + ')'));
    
    // If no male voices found for the specific language, try to find any male voice
    if (languageVoices.length === 0) {
      const maleVoices = voices.filter((voice: any) => 
        voice.name.toLowerCase().includes('male') || voice.gender === 'male'
      );
      
      console.log('All male voices found:', maleVoices.map((v: any) => v.name + ' (' + v.lang + ')'));
      
      // Return first male voice if found
      if (maleVoices.length > 0) {
        console.log('Selected fallback male voice:', maleVoices[0].name);
        return maleVoices[0];
      }
    }
    
    // Return first male voice if found, otherwise first voice for the language
    const selectedVoice = languageVoices.length > 0 ? languageVoices[0] : null;
    if (selectedVoice) {
      console.log('Selected voice:', selectedVoice.name);
    } else {
      console.log('No male voice found for language:', lang);
    }
    return selectedVoice;
  };

  const handleCloseChat = useCallback(() => {
    console.log('Closing chat box');
    setNaradAIOpen(false);
  }, [setNaradAIOpen]);
  
  const handleResetChat = useCallback(() => {
    console.log('Resetting chat');
    // Clear messages but preserve the greeting
    clearMessages();
    // Reset loading state in case it's stuck
    setLocalError(null);
    // Reset input
    setInputMessage('');
    setInterimTranscript('');
  }, [clearMessages]);
  
  const toggleVoiceToVoiceMode = useCallback(() => {
    console.log('Toggling voice-to-voice mode from', voiceToVoiceMode, 'to', !voiceToVoiceMode);
    setVoiceToVoiceMode(prev => !prev);
  }, [voiceToVoiceMode]);

  // Memoize processed messages to prevent re-processing on every render
  const processedMessages = useMemo(() => {
    console.log('Processing messages:', messages);
    const result = messages.map(message => {
      // Ensure content exists before processing
      const content = message.content || '';
      const processedContent = processMarkdown(content);
      
      // Detect the language of this message for proper styling
      const messageLanguage = detectLanguageFromText(content);
      
      return {
        ...message,
        processedContent,
        language: messageLanguage // Store the detected language with the message
      };
    });
    console.log('Processed messages:', result);
    return result;
  }, [messages]);
  
  // Log processed messages for debugging
  useEffect(() => {
    console.log('Processed messages updated:', processedMessages);
    console.log('Processed messages length:', processedMessages.length);
    console.log('Raw messages:', messages);
    console.log('Raw messages length:', messages.length);
  }, [processedMessages, messages]);

  // Memoize language options to prevent re-rendering
  const languageOptions = useMemo(() => [
    { value: 'hi', label: 'हिंदी' },
    { value: 'en', label: 'English' },
    { value: 'bn', label: 'বাংলা' },
    { value: 'ta', label: 'தமிழ்' },
    { value: 'te', label: 'తెలుగు' }
  ], []);

  const handleClick = () => {
    // Open the AI chat
    // @ts-ignore
    setNaradAIOpen(true)
  }

  return (
    // @ts-ignore
    <div 
      className={`fixed inset-0 z-50 ${isNaradAIOpen ? 'block' : 'hidden'}`} 
      style={{ display: isNaradAIOpen ? 'block' : 'none' }}
    >
      <motion.div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleCloseChat}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div 
        className="absolute bottom-4 right-4 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Bot className="text-primary-600" size={20} />
            </motion.div>
            <div>
              <h3 className="text-white font-semibold">Narad AI</h3>
              <p className="text-primary-100 text-xs">Your Cultural Guide</p>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Language Selection Dropdown */}
            <motion.select
              value={selectedSpeechLang}
              onChange={(e) => {
                const newLang = e.target.value as 'hi' | 'en' | 'bn' | 'ta' | 'te';
                setSelectedSpeechLang(newLang);
                // Update speech recognition language if it's initialized
                if (recognitionRef.current && speechSupported) {
                  const speechLang = getSpeechLang();
                  console.log('Updating speech recognition language to:', speechLang);
                  recognitionRef.current.lang = speechLang;
                  // Restart recognition with new language if currently recording
                  if (isRecording) {
                    try {
                      recognitionRef.current.stop();
                      setTimeout(() => {
                        recognitionRef.current.start();
                      }, 100);
                    } catch (error) {
                      console.error('Error restarting speech recognition with new language:', error);
                    }
                  }
                }
              }}
              className="narad-ai-dropdown"
              title="Select language for speech"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </motion.select>
            <motion.button
              onClick={handleResetChat}
              className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all duration-200"
              aria-label="Reset chat"
              title="Reset chat"
              whileHover={{ scale: 1.1, rotate: 45 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw size={16} />
            </motion.button>
            <motion.button
              onClick={toggleVoiceToVoiceMode}
              className={`p-2 rounded-full ${voiceToVoiceMode ? 'bg-white text-primary-600' : 'bg-primary-500 text-white'}`}
              aria-label={voiceToVoiceMode ? "Disable voice mode" : "Enable voice mode"}
              title={voiceToVoiceMode ? "Disable voice-to-voice mode" : "Enable voice-to-voice mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Headphones size={16} />
            </motion.button>
            <motion.button
              onClick={handleCloseChat}
              className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-all duration-200"
              aria-label="Close chat"
              title="Close chat"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          </motion.div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 font-sans">
          <AnimatePresence>
            {processedMessages.map((message, index) => {
              // Define font families for different languages
              const getFontClass = (lang: string) => {
                switch(lang) {
                  case 'hi': return 'font-hindi';
                  case 'bn': return 'font-bengali';
                  case 'ta': return 'font-tamil';
                  case 'te': return 'font-telugu';
                  default: return ''; // Default to Bitter (from tailwind config) for English and others
                }
              };
              
              const fontClass = getFontClass(message.language || 'en');
              
              return (
                <motion.div
                  key={message.id}
                  className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <motion.div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                    } ${fontClass}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {message.role === 'assistant' ? (
                      <div className="flex items-start">
                        <motion.div 
                          className="flex-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {message.processedContent}
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {message.processedContent}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {/* Loading indicator when AI is thinking */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                className="flex justify-start mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm">
                  <div className="flex items-center">
                    <motion.div 
                      className="loading-dots"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </motion.div>
                    <span className="ml-2 text-gray-500">Narad is thinking...</span>
                  </div>
                  <motion.div 
                    className="mt-1 text-xs text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    This may take a few moments
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <motion.div 
          className="border-t border-gray-200 p-4 bg-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <AnimatePresence>
            {localError && (
              <motion.div 
                className="mb-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div>{localError}</div>
                  <div className="flex gap-2 mt-2">
                    <motion.button 
                      onClick={handleSendMessage}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Retry
                    </motion.button>
                    <motion.button 
                      onClick={handleResetChat}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset Chat
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center space-x-2">
            {/* Speech-to-text recording button */}
            <motion.button
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
              whileHover={{ scale: !isRecording && speechSupported && audioEnabled ? 1.1 : 1 }}
              whileTap={{ scale: !isRecording && speechSupported && audioEnabled ? 0.9 : 1 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </motion.button>
            <div className="flex-1 relative voice-input-container">
              <motion.input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Indian culture..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white relative z-10"
                title="Type your message here"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              {interimTranscript && (
                <motion.div 
                  className="voice-input-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="voice-input-text">
                    {inputMessage}
                    <span className="voice-input-interim">{interimTranscript}</span>
                  </span>
                </motion.div>
              )}
            </div>
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              type="button" // Add explicit type to prevent form submission
              className={`p-2 rounded-full ${
                inputMessage.trim() && !isLoading
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-all duration-200`}
              aria-label="Send message"
              title="Send message"
              whileHover={{ scale: inputMessage.trim() && !isLoading ? 1.1 : 1 }}
              whileTap={{ scale: inputMessage.trim() && !isLoading ? 0.9 : 1 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Send size={16} />
            </motion.button>
          </div>
          {/* COMMENT OUT voice-to-voice mode indicator */}
          <AnimatePresence>
            {voiceToVoiceMode && (
              <motion.div 
                className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm text-blue-700 flex items-center">
                  <Headphones size={14} className="mr-1" />
                  Voice-to-voice mode active
                </span>
                <motion.button
                  onClick={toggleVoiceToVoiceMode}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded flex items-center"
                  title="Stop voice-to-voice mode"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <StopCircle size={12} className="mr-1" />
                  Stop
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default React.memo(NaradAIChatComponent);