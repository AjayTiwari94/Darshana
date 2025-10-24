import { create } from 'zustand'

// ===== UI STORE =====
interface UIState {
  isSearchOpen: boolean
  isMobileMenuOpen: boolean
  isNaradAIOpen: boolean
  setSearchOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setNaradAIOpen: (open: boolean) => void
  toggleSearch: () => void
  toggleMobileMenu: () => void
  toggleNaradAI: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isNaradAIOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setNaradAIOpen: (open) => set({ isNaradAIOpen: open }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleNaradAI: () => set((state) => ({ isNaradAIOpen: !state.isNaradAIOpen })),
}))

interface AuthState {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  setUser: (user: any) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
  updateProfile: (profileData: any) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  login: async (email: string, password: string) => {
    // Add browser check
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      set({ isLoading: true })
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      // Call the backend API
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store the token in localStorage and cookies
      if (data.token) {
        localStorage.setItem('token', data.token)
        // Set cookie for middleware
        document.cookie = `token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      }

      // Update the user state
      set({
        user: data.user || data.data,
        isAuthenticated: true,
        isLoading: false,
        token: data.token,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  logout: () => {
    // Add browser check
    if (typeof window === 'undefined') {
      return
    }
    
    localStorage.removeItem('token')
    // Remove cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    set({ user: null, isAuthenticated: false, token: null })
  },
  setLoading: (loading) => set({ isLoading: loading }),
  initialize: async () => {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        set({ isLoading: false })
        return
      }

      const token = localStorage.getItem('token')
      
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false, token: null })
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      // Fetch current user with token
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      })

      if (!response.ok) {
        // Token is invalid, clear it
        localStorage.removeItem('token')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        set({ user: null, isAuthenticated: false, isLoading: false, token: null })
        return
      }

      const data = await response.json()
      
      set({
        user: data.user || data.data,
        isAuthenticated: true,
        isLoading: false,
        token: token,
      })
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
      set({ user: null, isAuthenticated: false, isLoading: false, token: null })
    }
  },
  
  updateProfile: async (profileData: any) => {
    // Add browser check
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      set({ isLoading: true })
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed')
      }

      set({
        user: { ...data.user, ...profileData },
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
}))

interface NaradAIState {
  isOpen: boolean
  isNaradAIOpen: boolean
  messages: Array<{
    id: string
    role: 'user' | 'ai' | 'assistant'
    content: string
    timestamp: Date
  }>
  isLoading: boolean
  isProcessing: boolean
  sessionId: string | null
  hasInitialized: boolean
  error: string | null
  setOpen: (open: boolean) => void
  setNaradAIOpen: (open: boolean) => void
  toggleOpen: () => void
  addMessage: (message: { role: 'user' | 'ai' | 'assistant'; content: string }) => Promise<void>
  setLoading: (loading: boolean) => void
  setProcessing: (processing: boolean) => void
  setSessionId: (sessionId: string) => void
  setError: (error: string | null) => void
  clearMessages: () => void
  startSession: (sessionId?: string) => void
  endSession: () => void
  initializeWithGreeting: () => void
  setInitialInput: (input: string) => void
}

export const useNaradAIStore = create<NaradAIState>((set, get) => ({
  isOpen: false,
  isNaradAIOpen: false,
  messages: [],
  isLoading: false,
  isProcessing: false,
  sessionId: null,
  hasInitialized: false,
  error: null,
  
  setOpen: (open) => set({ isOpen: open, isNaradAIOpen: open }),
  setNaradAIOpen: (open) => set({ isOpen: open, isNaradAIOpen: open }),
  toggleOpen: () => set((state) => ({ 
    isOpen: !state.isOpen, 
    isNaradAIOpen: !state.isNaradAIOpen 
  })),
  
  addMessage: async (message) => {
    const { role, content } = message
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `${Date.now()}-${Math.random()}`,
          role,
          content,
          timestamp: new Date(),
        },
      ],
    }))
  },
  
  setLoading: (loading) => set({ isLoading: loading, isProcessing: loading }),
  setProcessing: (processing) => set({ isProcessing: processing, isLoading: processing }),
  setSessionId: (sessionId) => set({ sessionId }),
  setError: (error) => set({ error }),
  
  clearMessages: () => set({ 
    messages: [], 
    hasInitialized: false,
    error: null 
  }),
  
  startSession: (customSessionId?: string) => {
    const sessionId = customSessionId || `session-${Date.now()}`
    set({ 
      sessionId,
      messages: [],
      hasInitialized: false,
      error: null 
    })
  },
  
  endSession: () => set({ 
    messages: [], 
    sessionId: null,
    hasInitialized: false,
    error: null 
  }),
  
  initializeWithGreeting: () => {
    const state = get()
    if (!state.hasInitialized && state.messages.length === 0) {
      const greeting = `Namaste! 🙏 I am Narad AI, your guide to the rich heritage and cultural treasures of India.\n\nI can help you discover:\n• Historical monuments and their fascinating stories\n• Ancient myths, legends, and cultural traditions\n• Sacred places and their spiritual significance\n• Art, architecture, and heritage sites\n\nWhat would you like to explore today?`
      
      set({
        messages: [
          {
            id: `${Date.now()}-greeting`,
            role: 'ai',
            content: greeting,
            timestamp: new Date(),
          },
        ],
        hasInitialized: true,
        sessionId: `session-${Date.now()}`,
      })
    }
  },
  
  setInitialInput: (input: string) => {
    // This function can be used to set an initial input for the chat
    // Implementation can be added as needed
  },
}))

// Default export for easier imports
export default {
  useUIStore,
  useAuthStore,
  useNaradAIStore,
}

